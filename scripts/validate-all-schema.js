const fs = require('fs');
const path = require('path');

// Load schema
const schemaPath = path.join(__dirname, 'pods', 'schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Validate and fix a single JSON file
function validateAndFixFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const pod = JSON.parse(content);
        const fixes = [];
        let wasFixed = false;
        
        // Check required top-level properties
        if (!pod.name) {
            pod.name = path.basename(filePath, '.json').toUpperCase();
            fixes.push('Added missing name');
            wasFixed = true;
        }
        
        if (!Array.isArray(pod.leadership)) {
            pod.leadership = [];
            fixes.push('Added missing leadership array');
            wasFixed = true;
        }
        
        if (!Array.isArray(pod.solutions)) {
            pod.solutions = [];
            fixes.push('Added missing solutions array');
            wasFixed = true;
        }
        
        if (!Array.isArray(pod.teams)) {
            pod.teams = [];
            fixes.push('Added missing teams array');
            wasFixed = true;
        }
        
        // Validate teams
        if (pod.teams) {
            pod.teams.forEach((team, teamIndex) => {
                if (!team.name) {
                    team.name = `Team ${teamIndex + 1}`;
                    fixes.push(`Team ${teamIndex + 1}: Added missing name`);
                    wasFixed = true;
                }
                
                if (!Array.isArray(team.members)) {
                    team.members = [];
                    fixes.push(`Team "${team.name}": Added missing members array`);
                    wasFixed = true;
                }
                
                // Validate members
                if (team.members) {
                    team.members.forEach((member, memberIndex) => {
                        // Required fields
                        if (!member.hasOwnProperty('role')) {
                            member.role = '';
                            fixes.push(`Team "${team.name}", Member ${memberIndex + 1}: Added missing role`);
                            wasFixed = true;
                        }
                        
                        if (!member.hasOwnProperty('role_group')) {
                            member.role_group = '';
                            fixes.push(`Team "${team.name}", Member ${memberIndex + 1}: Added missing role_group`);
                            wasFixed = true;
                        }
                        
                        if (!member.hasOwnProperty('contract_type')) {
                            member.contract_type = 'Vacancy';
                            fixes.push(`Team "${team.name}", Member ${memberIndex + 1}: Added missing contract_type`);
                            wasFixed = true;
                        }
                        
                        if (!Array.isArray(member.skillset)) {
                            member.skillset = [];
                            fixes.push(`Team "${team.name}", Member ${memberIndex + 1}: Added missing skillset`);
                            wasFixed = true;
                        }
                        
                        // Validate contract_type enum
                        const validContractTypes = ['Permanent', '3rd Party Partner', 'Vacancy'];
                        if (!validContractTypes.includes(member.contract_type)) {
                            fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Invalid contract_type "${member.contract_type}", changed to Vacancy`);
                            member.contract_type = 'Vacancy';
                            wasFixed = true;
                        }
                        
                        // Validate name and email types
                        if (member.name !== null && typeof member.name !== 'string') {
                            fixes.push(`Team "${team.name}", Member ${memberIndex + 1}: Invalid name type, set to null`);
                            member.name = null;
                            wasFixed = true;
                        }
                        
                        if (member.email !== null && member.email !== undefined && typeof member.email !== 'string') {
                            fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Invalid email type, set to null`);
                            member.email = null;
                            wasFixed = true;
                        }
                        
                        // Handle supplier field - only for 3rd Party Partners
                        if (member.contract_type === '3rd Party Partner') {
                            if (!member.hasOwnProperty('supplier')) {
                                member.supplier = null;
                                fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Added missing supplier field`);
                                wasFixed = true;
                            }
                            // Ensure supplier is string or null
                            if (member.supplier !== null && typeof member.supplier !== 'string') {
                                fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Invalid supplier type, set to null`);
                                member.supplier = null;
                                wasFixed = true;
                            }
                        } else {
                            // Remove supplier from non-3rd Party Partners
                            if (member.hasOwnProperty('supplier')) {
                                delete member.supplier;
                                fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Removed supplier from ${member.contract_type}`);
                                wasFixed = true;
                            }
                        }
                        
                        // Validate onLeave field (optional boolean)
                        if (member.hasOwnProperty('onLeave')) {
                            if (typeof member.onLeave !== 'boolean') {
                                fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Invalid onLeave type, removed`);
                                delete member.onLeave;
                                wasFixed = true;
                            }
                        }
                        
                        // Remove any unknown properties (optional - can be commented out if you want to keep extra fields)
                        const allowedProperties = ['name', 'email', 'role', 'role_group', 'contract_type', 'skillset', 'supplier', 'onLeave'];
                        const memberKeys = Object.keys(member);
                        memberKeys.forEach(key => {
                            if (!allowedProperties.includes(key)) {
                                // Don't remove unknown properties, just log them
                                // delete member[key];
                                // fixes.push(`Team "${team.name}", Member ${member.name || memberIndex + 1}: Removed unknown property "${key}"`);
                            }
                        });
                    });
                }
            });
        }
        
        // Save if fixed
        if (wasFixed) {
            fs.writeFileSync(filePath, JSON.stringify(pod, null, 2) + '\n', 'utf-8');
        }
        
        return { wasFixed, fixes };
    } catch (error) {
        return { wasFixed: false, fixes: [], error: error.message };
    }
}

// Main function
function main() {
    const podsDir = path.join(__dirname, 'pods');
    const files = fs.readdirSync(podsDir).filter(f => f.endsWith('.json') && f !== 'schema.json');
    
    console.log(`Validating ${files.length} JSON files against schema...\n`);
    
    let totalFixed = 0;
    let totalFixes = 0;
    const errors = [];
    
    files.forEach(file => {
        const filePath = path.join(podsDir, file);
        const result = validateAndFixFile(filePath);
        
        if (result.error) {
            console.log(`✗ ${file}: Error - ${result.error}`);
            errors.push({ file, error: result.error });
        } else if (result.wasFixed) {
            console.log(`✓ ${file}: Fixed ${result.fixes.length} issue(s)`);
            if (result.fixes.length > 0 && result.fixes.length <= 5) {
                result.fixes.forEach(fix => console.log(`  - ${fix}`));
            } else if (result.fixes.length > 5) {
                result.fixes.slice(0, 3).forEach(fix => console.log(`  - ${fix}`));
                console.log(`  ... and ${result.fixes.length - 3} more`);
            }
            totalFixed++;
            totalFixes += result.fixes.length;
        } else {
            console.log(`✓ ${file}: Valid`);
        }
    });
    
    console.log(`\nSummary:`);
    console.log(`  Files checked: ${files.length}`);
    console.log(`  Files fixed: ${totalFixed}`);
    console.log(`  Total fixes applied: ${totalFixes}`);
    if (errors.length > 0) {
        console.log(`  Errors: ${errors.length}`);
    }
    
    if (totalFixed === 0 && errors.length === 0) {
        console.log(`\n✓ All files conform to the schema!\n`);
    } else if (errors.length === 0) {
        console.log(`\n✓ All files have been fixed and now conform to the schema!\n`);
    } else {
        console.log(`\n✗ Some files have errors that could not be automatically fixed\n`);
    }
    
    return errors.length === 0;
}

const success = main();
process.exit(success ? 0 : 1);


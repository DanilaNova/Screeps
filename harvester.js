/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester');
 * mod.thing == 'a thing'; // true
 */
function harvest(creep, sources) {
    let leftovers = creep.room.find(FIND_DROPPED_RESOURCES);
    if(leftovers.length > 0) {
        leftovers = creep.pos.findClosestByPath(leftovers);
        if(creep.pickup(leftovers) == ERR_NOT_IN_RANGE) {
            creep.moveTo(leftovers);
        }
    } else {
        let ruins = creep.room.find(FIND_RUINS).filter(ruin => (ruin.store.getUsedCapacity() > 0));
        if(ruins.length > 0) {
            ruins = creep.pos.findClosestByPath(ruins);
            if(creep.withdraw(ruins, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(ruins);
            }
        } else {
            let source = creep.pos.findClosestByPath(sources);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}

module.exports = function(creep, sources, spawns) {
    switch (creep.memory["state"]) {
        case 0:
            let spawn = creep.pos.findClosestByPath(spawns);
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
            break;
        case 1:
            harvest(creep, sources);
            break;
        default:
            creep.memory["state"] = 1;
            harvest(creep, sources);
    }

    if(creep.store.getFreeCapacity() == 0 & creep.memory["state"] != 0) {
        creep.memory["state"] = 0;
        creep.say("Складываю");
    } else if(creep.store.getUsedCapacity() == 0 & creep.memory["state"] != 1) {
        creep.memory["state"] = 1;
        creep.say("Добываю");
    }
}

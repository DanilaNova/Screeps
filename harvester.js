/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester');
 * mod.thing == 'a thing'; // true
 */
function harvest(creep) {
    let leftovers = creep.room.find(FIND_DROPPED_RESOURCES);
    if(leftovers.length > 0) {
        leftovers = creep.pos.findClosestByPath(leftovers);
        if(creep.pickup(leftovers) == ERR_NOT_IN_RANGE) {
            if(creep.memory._move) {
                if(creep.memory._move.dest != leftovers.pos) {
                    creep.moveTo(leftovers);
                }
            } else {creep.moveTo(leftovers)}
        }
    } else {
        let ruins = creep.room.find(FIND_RUINS).filter(ruin => (ruin.store.getUsedCapacity() > 0));
        if(ruins.length > 0) {
            ruins = creep.pos.findClosestByPath(ruins);
            if(creep.withdraw(ruins, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if(creep.memory._move) {
                    if(creep.memory._move.dest != ruins.pos) {
                        creep.moveTo(ruins);
                    }
                } else {creep.moveTo(ruins)}
            }
        } else {
            let source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}

module.exports = function(creep) {
    if(creep.store.getFreeCapacity() == 0 & creep.memory["state"] != 0) {
        creep.memory["state"] = 0;
        creep.say("Складываю");
    } else if(creep.store.getUsedCapacity() == 0 & creep.memory["state"] != 1) {
        creep.memory["state"] = 1;
        creep.say("Добываю");
    }

    switch (creep.memory["state"]) {
        case 0:
            let spawn = creep.pos.findClosestByPath(creep.room.find(FIND_MY_SPAWNS));
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
            break;
        case 1:
            harvest(creep);
            break;
        default:
            creep.memory["state"] = 1;
            harvest(creep);
    }
}

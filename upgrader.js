/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrader');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(creep) {
    if(creep.store.getUsedCapacity() == 0) {
        let spawn = creep.pos.findClosestByPath(creep.room.find(FIND_MY_SPAWNS));
        if(creep.memory._move) {
            if(creep.memory._move.dest != spawn.pos) {
                creep.moveTo(spawn);
            }
        } else {creep.moveTo(spawn);}
        if(spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 100) {
            creep.withdraw(spawn, RESOURCE_ENERGY)
        }
    } else {
        let controller = creep.room.controller
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            if(creep.memory._move) {
                if(creep.memory._move.dest != controller.pos) {
                    creep.moveTo(controller);
                }
            } else {creep.moveTo(controller);}
        }
    }
}
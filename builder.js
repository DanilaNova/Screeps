/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(creep) {
    if(creep.store.getUsedCapacity() == 0) {
        creep.memory["task"] == null; // TODO: force the builders not to change the task until the previous one is completed
        let spawn = creep.pos.findClosestByPath(creep.room.find(FIND_MY_SPAWNS));
        creep.moveTo(spawn);
        if(spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 200) {
            creep.withdraw(spawn, RESOURCE_ENERGY);
        }
    } else {
        let repair = creep.room.find(FIND_STRUCTURES).filter(struct => struct.structureType == STRUCTURE_ROAD & struct.hitsMax - struct.hits >= 100);
        if(repair.length > 0) {
            repair = creep.pos.findClosestByPath(repair)
            if(creep.repair(repair) == ERR_NOT_IN_RANGE) {
                if(creep.memory._move) {
                    if(creep.memory._move.dest != repair.pos) {
                        creep.moveTo(repair);
                    }
                } else {creep.moveTo(repair)}
            }
        } else {
            let build = creep.pos.findClosestByPath(creep.room.find(FIND_MY_CONSTRUCTION_SITES));
            if(creep.build(build) == ERR_NOT_IN_RANGE) {
                if(creep.memory._move) {
                    if(creep.memory._move.dest != build.pos) {
                        creep.moveTo(build);
                    }
                } else {creep.moveTo(build)}
            }
        }
    }
}

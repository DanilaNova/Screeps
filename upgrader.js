/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrader');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(creep, spawns) {
    if(creep.store.getUsedCapacity() == 0) {
        let spawn = creep.pos.findClosestByPath(spawns);
        creep.moveTo(spawn);
        if(spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 200) {
            creep.withdraw(spawn, RESOURCE_ENERGY)
        }
    } else {
        let controller = creep.room.controller
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    }
}

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('architector');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(room, sources, structures) {
    let path = room.controller.pos.findPathTo(room.controller.pos.findClosestByPath(FIND_MY_SPAWNS, {ignoreCreeps: true}), {ignoreCreeps: true});
    let sources = room.find(FIND_SOURCES);
    path.pop();
    path.forEach(pos => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
    });
    sources.forEach(source => {
        let base = room.find(FIND_MY_STRUCTURES).filter(stuct => stuct.structureType == STRUCTURE_SPAWN | stuct.structureType == STRUCTURE_EXTENSION);
        let cb = source.pos.findClosestByPath(base, {ignoreCreeps: true})
        if(cb) {
            base = base.concat(room.find(FIND_MY_CONSTRUCTION_SITES).filter(stuct => stuct.structureType == STRUCTURE_SPAWN | stuct.structureType == STRUCTURE_EXTENSION));
            let path = source.pos.findPathTo(cb, {ignoreCreeps: true});
            path.pop();
            path.forEach(pos => {
               room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            });
        } else {
            console.log("Architector: Cannot find closest to source base stucture!");
            Game.notify("From Architector on " + Game.shard.name + "\nCannot find closest to source base stucture!");
        }
    });
}

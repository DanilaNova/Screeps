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
        let path = source.pos.findPathTo(room.controller.pos.findClosestByPath(room.find(FIND_MY_SPAWNS)), {ignoreCreeps: true});
        path.pop();
        path.forEach(pos => {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        });
    });
}
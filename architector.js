/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('architector');
 * mod.thing == 'a thing'; // true
 */
function go(room, sources, structures, sites) {
    let path = room.controller.pos.findPathTo(room.controller.pos.findClosestByPath(FIND_MY_SPAWNS, {ignoreCreeps: true}), {ignoreCreeps: true});

    path.pop();
    path.shift();
    path.shift();
    path.forEach(pos => {
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
    });
    sources.forEach(source => {
        let base = structures.filter(stuct => stuct.structureType == STRUCTURE_SPAWN | stuct.structureType == STRUCTURE_EXTENSION);
        let cb = source.pos.findClosestByPath(base, {ignoreCreeps: true})
        if(cb) {
            base = base.concat(sites.filter(stuct => stuct.structureType == STRUCTURE_SPAWN | stuct.structureType == STRUCTURE_EXTENSION));
            path = source.pos.findPathTo(cb, {ignoreCreeps: true});
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

module.exports = function(room, sources, structures, sites) {
    if(!Memory["rooms"]) {
        Memory["rooms"] = {};
        Memory["rooms"][room.name] = {checked: true, structuresCount: structures.length, controllerLevel: room.controller.level};
        go(room, sources, structures, sites);
    } else if(!Memory["rooms"][room.name]) {
        Memory["rooms"][room.name] = {checked: true, structuresCount: structures.length, controllerLevel: room.controller.level};
        go(room, sources, structures, sites);
    } else if(!Memory["rooms"][room.name].checked) {
        Memory["rooms"][room.name].checked = true;
        Memory["rooms"][room.name].structuresCount = structures.length;
        Memory["rooms"][room.name].controllerLevel = room.controller.level;
        go(room, sources, structures, sites);
    } else if(Memory["rooms"][room.name].structuresCount != structures.length) {
        Memory["rooms"][room.name].structuresCount = structures.length;
        go(room, sources, structures, sites);
    } else if(Memory["rooms"][room.name].controllerLevel != room.controller.level) {
        Memory["rooms"][room.name].controllerLevel = room.controller.level;
        go(room, sources, structures, sites);
    }
}

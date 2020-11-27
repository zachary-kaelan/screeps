var roleFunctions = require('roleFunctions');

var roleMender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.mending && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mending = false;
            creep.say('📥 gather');
        }
        if(!creep.memory.mending && creep.store.getFreeCapacity() == 0) {
            creep.memory.mending = true;
            creep.say('🚧 repair');
        }

        if(creep.memory.mending) {
            var target = creep.pos.findClosestByRange(
                FIND_STRUCTURES,
                { filter: (structure) => 
                    structure.hits < (structure.hitsMax / 3) &&
                        structure.structureType != STRUCTURE_WALL
                }
            );
            //console.log(creep.name);
            if(target) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var waitFlag = Game.flags['Wait' + creep.memory.source];
                if (!creep.pos.isEqualTo(waitFlag)) {
                    creep.moveTo(waitFlag);
                }
            }
        }
        else {
            creep.getResources(true);
            /*var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
        }
    }
};

module.exports = roleMender;
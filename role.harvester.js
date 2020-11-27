var roleFunctions = require('roleFunctions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var haulers = _.filter(Game.creeps, (hauler) => hauler.memory.role == 'hauler' && hauler.memory.source == creep.memory.source);
        if(creep.store.getFreeCapacity() != 0) {
            if (creep.pos.isEqualTo(35, 45)) {
                creep.move(TOP_LEFT);
            }
            creep.goHarvest();
            //console.log(creep.name);
        }
        else if (haulers.length == 0) {
            console.log(creep.name);
            if (!creep.depositResources()) {
                var creepSource = creep.room.find(FIND_SOURCES)[creep.memory.source];
                creep.moveTo(creepSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var creepSource = creep.room.find(FIND_SOURCES)[creep.memory.source];
            creep.moveTo(creepSource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = roleHarvester;
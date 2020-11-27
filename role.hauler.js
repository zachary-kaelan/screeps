var roleFunctions = require('roleFunctions');

var roleHauler = {
    run: function(creep) {
        var goal = creep.memory.goal;
        creep.upgradeController(creep.room.controller);
        if (!creep.memory.inPos) {
            if (goal == 'collect')
            {
                targets = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10);
                if (targets.length > 0) {
                    target = targets[0];
                    if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    else if (creep.store.getFreeCapacity() == 0) {
                        creep.memory.goal = 'deposit';
                    }
                    return;
                }
                var srcFlag = Game.flags['Haul' + creep.memory.source];
                creep.moveTo(srcFlag, {visualizePathStyle: {stroke: '#00ff00'}});
                if (creep.pos.isEqualTo(srcFlag.pos)) {
                    creep.memory.inPos = true;
                    creep.say('📥 collect');
                } else if (creep.pos.isEqualTo(21, 40)) {
                    creep.move(BOTTOM);
                }
            } else if (goal == 'deposit'){
                if (creep.depositResources()) {
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        if (creep.room.energyAvailable < 400) {
                            // Move from storage to spawning energy pools
                            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (
                                        structure.structureType == STRUCTURE_CONTAINER ||
                                        structure.structureType == STRUCTURE_STORAGE
                                    ) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 150;
                                }
                            });
                            
                            if (target) {
                                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                                return;
                            }
                        }
                        creep.memory.goal = 'collect';
                        creep.memory.inPos = false;
                    }
                } else {
                    creep.memory.goal = 'distribute';
                    var dumpFlag = Game.flags['DumpUpgrade'];
                    creep.moveTo(dumpFlag, {visualizePathStyle: {stroke: '#00ff00'}});
                    if (creep.pos.isEqualTo(dumpFlag.pos)) {
                        creep.memory.inPos = true;
                        creep.say('📤 distribute');
                    }
                }
            } else if (goal == 'distribute') {
                var dumpFlag = Game.flags['DumpUpgrade'];
                creep.moveTo(dumpFlag, {visualizePathStyle: {stroke: '#00ff00'}});
                if (creep.pos.isEqualTo(dumpFlag.pos)) {
                    creep.memory.inPos = true;
                    creep.say('📤 distribute');
                }
                
            }
        } else if (goal == 'collect') {
            var adjCreeps = creep.pos.findInRange(
                FIND_MY_CREEPS, 1, {
                    filter: (adjCreep) => {
                        return adjCreep.memory.role == 'harvester';
                    }
                }
            );
            
            var length = adjCreeps.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i)
                {
                    var adjHarvester = adjCreeps[i];
                    adjHarvester.transfer(creep, RESOURCE_ENERGY);
                    creep.pickup(creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES));
                    
                }
            }
            
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.goal = 'deposit';
                creep.memory.inPos = false;
            }
        } else if (goal == 'distribute') {
            var adjCreeps = creep.pos.findInRange(
                FIND_MY_CREEPS, 1, {
                    filter: (adjCreep) => {
                        return adjCreep.memory.role == 'upgrader' && 
                            adjCreep.store.getUsedCapacity(RESOURCE_ENERGY) <= 25;
                    }
                }
            );
        
            if (adjCreeps.length > 0) {
                creep.transfer(adjCreeps[0], RESOURCE_ENERGY);
            } 
            else {
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.goal = 'deposit';
                    creep.depositResources();
                } else {
                    creep.goal = 'collect';
                    creep.inPos = false;
                }
            }
            
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.goal = 'collect';
                creep.memory.inPos = false;
            }
        } else if (goal == 'deposit') {
            if (creep.depositResources()) {
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.goal = 'collect';
                    creep.memory.inPos = false;
                }
            } else {
                creep.memory.goal = 'distribute';
                var dumpFlag = Game.flags['DumpUpgrade'];
                creep.moveTo(dumpFlag, {visualizePathStyle: {stroke: '#00ff00'}});
                if (creep.pos.isEqualTo(dumpFlag.pos)) {
                    creep.memory.inPos = true;
                    creep.say('📤 distribute');
                }
            }
        }
    }
}

module.exports = roleHauler;
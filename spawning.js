/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawning');
 * mod.thing == 'a thing'; // true
 */

const spawnNew = true;
const currentRoom = Game.rooms['E38N6'];
const NUM_SOURCES = 2;
const spawn1 = Game.spawns['EasyMuggings'];

module.exports = {
    spawnCreeps: function() {
        if(spawn1.spawning) {
            var spawningCreep = Game.creeps[spawn1.spawning.name];
            if (spawningCreep && spawningCreep.spawning) {
                console.log('spawn busy');
                currentRoom.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn1.pos.x + 1,
                    spawn1.pos.y,
                    {align: 'left', opacity: 0.8});
                return;
            }
        }
        
        var usedCapacity = currentRoom.energyAvailable;
        
        var myConstructionSites = currentRoom.find(FIND_MY_CONSTRUCTION_SITES);
        if (myConstructionSites.length == 0) {
            Game.notify("All construction sites built.");
        }
        
        var storageAvailable = currentRoom.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 1000
        });
        
        var totalSurplus = _.reduce(
            storageAvailable,
            (sum, structure) => 
                sum + structure.store.getUsedCapacity(RESOURCE_ENERGY),
            0
        );
        if (totalSurplus == 0) {
            Game.notify('Surplus is empty', 180);
        }
        else {
            var totalSurplusCapacity = _.reduce(
                storageAvailable,
                (sum, structure) => 
                    sum + structure.store.getCapacity(RESOURCE_ENERGY),
                0
            );
            
            if (totalSurplus == totalSurplusCapacity) {
                Game.notify('Surplus is full', 180);
            }
        }
        
        var harvesters = [
            _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.source == 0),
            _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.source == 1)
        ];
        
        if (spawnNew && usedCapacity >= 200) {
            console.log('checking creeps: ' + usedCapacity + ' energy available');
            for (var i = 0; i < NUM_SOURCES; i++) {
                var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.memory.source == i);
                if (haulers.length < harvesters[i].length) {
                    var newName = i + '-Hauler' + Game.time;
                    //console.log('Spawning new hauler: ' + newName);
                    console.log('checking haulers at ' + i);
                    if (usedCapacity >= 400) {
                        spawn1.spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                            {memory: {role: 'hauler', source: i, goal: 'collect', inPos: false}});
                    } else if (usedCapacity >= 300 && haulers.length < 2) {
                        spawn1.spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                            {memory: {role: 'hauler', source: i, goal: 'collect', inPos: false}});
                    } else if (usedCapacity >= 200 && haulers.length < 1) {
                        spawn1.spawnCreep([CARRY,CARRY,MOVE,MOVE], newName,
                            {memory: {role: 'hauler', source: i, goal: 'collect', inPos: false}});
                    }
                    // Memory.haulers[i] = newName;
                    
                    console.log('spawning hauler at ' + i + ' next');
                    return;
                }
            }
            
            for (var i = 0; i < NUM_SOURCES; i++) {
                if(harvesters[i].length < 2) {
                    console.log('checking harvesters at ' + i);
                    var newName = i + '-Harvester' + Game.time;
                    if (usedCapacity >= 400) {
                        spawn1.spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName,
                            {memory: {role: 'harvester', source: i}});
                        console.log('spawning 3-work harvester');
                        //console.log('Spawning new harvester: ' + newName);
                        
                    }
                    else if (usedCapacity >= 300 && harvesters[i].length < 2) {
                        spawn1.spawnCreep([WORK,WORK,CARRY,MOVE], newName,
                            {memory: {role: 'harvester', source: i}});
                            console.log('spawning 2-work harvester');
                    }
                    else if (usedCapacity >= 200 && harvesters[i].length < 1) {
                        spawn1.spawnCreep([WORK,CARRY,MOVE], newName,
                            {memory: {role: 'harvester', source: i}});
                            console.log('spawning 1-work harvester');
                    }
                    
                    console.log('spawning harvester at ' + i + ' next');
                    return;
                }
            }
            
            for (var i = 0; i < NUM_SOURCES; i++) {
                var menders = _.filter(Game.creeps, (creep) => creep.memory.role == 'mender' && creep.memory.source == i);
                if (menders.length < 1) {
                    console.log('checking menders at ' + i);
                    var newName = i + '-Mender' + Game.time;
                    //console.log('Spawning new builder: ' + newName);
                    spawn1.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        {memory: {role: 'mender', source: i}});
                        
                    console.log('spawning mender at ' + i + ' next');
                    return;
                }
            }
            
            //console.log(storageAvailable.length);
            if (storageAvailable.length > 0) {
                console.log('checking builders/upgraders');
                for (var i = 0; i < NUM_SOURCES; i++) {
                    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.source == i);
                    if (builders.length < 1 && myConstructionSites.length > 0) {
                        console.log('checking builders at ' + i);
                        var newName = i + '-Builder' + Game.time;
                        //console.log('Spawning new builder: ' + newName);
                        spawn1.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                            {memory: {role: 'builder', source: i}});
                            
                        console.log('spawning builder at ' + i + ' next');
                        return;
                    }
                }
                
                var controllerLevel = currentRoom.controller.level;
                for (var i = 0; i < NUM_SOURCES; i++) {
                    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.source == i);
                    if (upgraders.length < 3/* && myConstructionSies.length == 0*/) {
                        console.log('checking upgraders at ' + i);
                        var newName = i + '-Upgrader' + Game.time;
                        //console.log('Spawning new upgrader: ' + newName);
                        spawn1.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
                            {memory: {role: 'upgrader', source: i}});
                            
                        console.log('spawning upgrader at ' + i + ' next');
                        return;
                    }
                }   
            }
        }
        
    }
};
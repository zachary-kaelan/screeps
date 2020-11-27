
var extensionsCaching = require('extensions.caching');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleGreeter = require('role.greeter');
var roleMender = require('role.mender');
var creepSpawning = require('spawning');
const spawn1 = Game.spawns['EasyMuggings'];
const currentRoom = Game.rooms['E38N6'];
const NUM_SOURCES = 2;

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var towers = currentRoom.find(STRUCTURE_TOWER);
    for (var tower in towers) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => { return structure.hits < structure.hitsMax &&
                structure.structureType != STRUCTURE_WALL; }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    
    creepSpawning.spawnCreeps();
    
    console.log('spawning - ' + Game.cpu.getUsed());

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.paused) {
            continue;
        }
        var creepRole = creep.memory.role;
        if (creepRole == 'hauler') {
            roleHauler.run(creep);
        }
        else if(creepRole == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creepRole == 'mender') {
            roleMender.run(creep);
        }
        else if(creepRole == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creepRole == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creepRole == 'greeter') {
            roleGreeter.run(creep);
        }
        else {
            console.log(creep.name + ' has no role');
        }
    }
    
    console.log('working - ' + Game.cpu.getUsed());
}
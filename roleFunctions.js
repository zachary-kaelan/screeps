const SRC0_HAUL_X = 43;
const SRC0_HAUL_Y = 34;

const SRC1_HAUL_X = 20;
const SRC1_HAUL_Y = 41;

Creep.prototype.goHarvest = function() {
    var creepSource = this.room.find(FIND_SOURCES)[this.memory.source];
    //console.log('harvesting at ' + creepSource.id);
    if(this.harvest(creepSource) == ERR_NOT_IN_RANGE) {
        //this.moveTo(creepSource);
        this.moveTo(creepSource, {visualizePathStyle: {stroke: '#ffaa00'}});
    } 
    else {
        this.pickup(this.pos.findClosestByRange(FIND_DROPPED_RESOURCES));
    }
}

Creep.prototype.getClosestFullStorage = function(override = false) {
    var target;
    if (this.memory.waiting && !override) {
        target = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 1000
        });
        
        if (target) {
            this.memory.waiting = false;
        }
    }
    else {
        target = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        });
        
        if (!target) {
            this.memory.waiting = true;
        }
    }
    return target;
}

Creep.prototype.getClosestFreeStorage = function() {
    var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (
                structure.structureType == STRUCTURE_EXTENSION || 
                structure.structureType == STRUCTURE_SPAWN
            ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    
    if (!target) {
        var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_TOWER || 
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_STORAGE
                ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
    }
    
    return target;
}

Creep.prototype.getResources = function(override = false) {
    targets = this.pos.findInRange(FIND_DROPPED_RESOURCES, 10);
    if (targets.length > 0) {
        target = targets[0];
        if (this.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0]);
        }
        return true;
    }
    
    var target = this.getClosestFullStorage(override);
    var waitFlag = Game.flags['Wait' + this.memory.source];
    var usedCapacity = this.room.energyAvailable;
    
    if (target && usedCapacity > 350) {
        if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
        return true;
    } 
    else {
        if (!this.pos.isEqualTo(waitFlag)) {
            this.moveTo(waitFlag);
        }
        return false;
    }
}

Creep.prototype.depositResources = function() {
    var target = this.getClosestFreeStorage();
    
    if (target) {
        //console.log('depositing to ' + target.id);
        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        }
        return true;
    } else {
        return false;
        this.say('no dest');
    }
}
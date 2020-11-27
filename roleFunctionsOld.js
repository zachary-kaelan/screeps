if (!Creep.prototype.tryHarvest) {
    Creep.prototype.tryHarvest = function() {
        console.log(Game.cpu.getUsed());
        if(this.store.getFreeCapacity() == 0) {
            return false;
        }
        
        if (!this.memory.source) {
            this.memory.source = 0;
        }
        var creepSourceNum = this.memory.source;
        if (creepSourceNum < 0) {
            ++creepSourceNum;
            this.memory.source = creepSourceNum;
            console.log(Game.cpu.getUsed());
            return !this.store.getUsedCapacity(RESOURCE_ENERGY);
        }
        
        var sources = this.room.find(FIND_SOURCES);
        var newCreepSourceNum = creepSourceNum;
        var creepSource = sources[creepSourceNum];
        
        var moved = false;
        
        while (!moved) {
            if(this.harvest(creepSource) == ERR_NOT_IN_RANGE) {
                if (this.moveTo(creepSource, {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH) {
                    ++newCreepSourceNum;
                    if (newCreepSourceNum == sources.length) {
                        newCreepSourceNum = 0;
                    }
                    if (newCreepSourceNum == creepSourceNum) {
                        this.memory.source = -25;
                        console.log(this.name + ' cannot find a source.');
                        console.log(Game.cpu.getUsed());
                        return !this.store.getUsedCapacity(RESOURCE_ENERGY);
                    }
                    creepSource = sources[newCreepSourceNum];
                } else {
                    moved = true;
                }
            }
        }
        
        if (newCreepSourceNum != creepSourceNum) {
            this.memory.source = newCreepSourceNum;
        }
        console.log(Game.cpu.getUsed());
        return true;
    }
}


module.exports = {

};
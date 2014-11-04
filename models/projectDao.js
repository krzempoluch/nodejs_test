var filesystem = require('fs');
var models = {};
var relationships = {};
var entityDefinitionsPath = '/EntityDefinition';
var singleton = function singleton(){
	//------ polaczenie z baza danych-----------
	var config = require('../config/config.json');
	var sequelize = null;
	var Sequelize = require('sequelize');
	
	function connect(){
		sequelize = new Sequelize(config.database.database_name, config.database.username, config.database.password, {
		    dialect: config.database.database_engine, // or 'sqlite', 'postgres', 'mariadb'
		    protocol: config.database.database_engine,
		    port:    config.database.database_port, // or 5432 (for postgres)
		    host: config.database.database_host,
		  });
		sequelize.authenticate().complete(function(err) {
		  if (!!err) {
		    console.log('Unable to connect to the database:', err)
		  } else {
		    console.log('Connection has been established successfully.')
		  }
		})		
	}
	
	function sync(){
		//------synchronizacja z baza danych----------
		sequelize
		  .sync({ force: false })
		  .complete(function(err) {
		     if (!!err) {
		       console.log('An error occurred while creating the table:', err)
		     } else {
		       console.log('It worked!')
		     }
		  })
	}
	
	this.init = function init(){
		connect();
		//----------Inicjalizacja Encji
		console.log("==================================== path projektDao: "+__dirname + entityDefinitionsPath);
		filesystem.readdirSync(__dirname + entityDefinitionsPath).forEach(function(name){
	        var object = require(__dirname + entityDefinitionsPath + "/" + name);
	        var atributes = object.EntityAtributes || {};
	        var modelName = object.EntityName;
	        models[modelName] = sequelize.define(modelName, atributes);
	        if("EntityRelations" in object){
	            relationships[modelName] = object.EntityRelations;
	        }
	    });
//		console.log(models)
		for(var name in relationships){
            var relation = relationships[name];
            for(var relName in relation){
                var related = relation[relName];
                models[name][relName](models[related]);
            }
        }
		sync();
	}
	this.model = function (name){
        return models[name];
    }

    this.Seq = function (){
        return Sequelize;
    }
    
    this.save = function (entity){
    	entity
    	.save()
    	  .complete(function(err) {
    		    if (!!err) {
    		      console.log('The instance has not been saved:', err)
    		    } else {
    		      console.log('We have a persisted instance now')
    		    }
    		  });
    }
}
singleton.instance = null;

singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
        this.instance.init();
    }
    return this.instance;
}

module.exports = singleton.getInstance();


export default function(sequelize, DataTypes){
    let alias = "User_Interested";
    let cols = {
        Id:{
            type: DataTypes.MEDIUMINT,
            primaryKey: true,
            autoincrement: true
        },
        Nombre: {
            type:DataTypes.STRING(100),
            allowNull: false
        },
        Correo: {
            type:DataTypes.STRING(100),
            allowNull: false
        },
        Fecha_Inscripcion: {
            type:DataTypes.DATE,
            allowNull: false
        },
        
    };

let config = {
    timestamps: false,
    tableName: 'user_interested'
};
const User_Interested = sequelize.define(alias, cols, config);

return User_Interested;

}


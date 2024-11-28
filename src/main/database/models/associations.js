import { Projects } from './projects';
import { Calls } from './calls';
import { Technicians } from './technicians';
import { Headquarters } from './headquarters';

// Establecer relaciones entre los modelos
Calls.hasMany(Projects, { foreignKey: 'id_convocatoria' });
Projects.belongsTo(Calls, { foreignKey: 'id_convocatoria' });

Calls.hasMany(Technicians, { foreignKey: 'id_convocatoria' });
Technicians.belongsTo(Calls, { foreignKey: 'id_convocatoria' });

Headquarters.hasMany(Projects, { foreignKey: 'id_sede' });
Projects.belongsTo(Headquarters, { foreignKey: 'id_sede' });

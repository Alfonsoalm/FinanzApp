import { Assignments } from './assignments';
import { Calls } from './calls';
import { Headquarters } from './headquarters';
import { Holidays } from './holidays';
import { Phases } from './phases';
import { Projects } from './projects';
import { Salaries } from './salaries';
import { Technicians } from './technicians';
import { Vacation } from './vacation';
import { WorkDays } from './workDays';

// Establecer relaciones entre los modelos
Calls.hasMany(Projects, { foreignKey: 'id_convocatoria' });
Projects.belongsTo(Calls, { foreignKey: 'id_convocatoria' });

Headquarters.hasMany(Technicians, { foreignKey: 'id_sede' });
Technicians.belongsTo(Headquarters, { foreignKey: 'id_sede' });

Headquarters.hasMany(Projects, { foreignKey: 'id_sede' });
Projects.belongsTo(Headquarters, { foreignKey: 'id_sede' });

Assignments.belongsTo(Phases, { foreignKey: 'id_fase' });
Phases.hasMany(Assignments, { foreignKey: 'id_fase' });

Assignments.belongsTo(Technicians, { foreignKey: 'id_tecnico' });
Technicians.hasMany(Assignments, { foreignKey: 'id_tecnico' });

Salaries.belongsTo(Technicians, { foreignKey: 'id_tecnico' });
Technicians.hasMany(Salaries, { foreignKey: 'id_tecnico' });

Phases.belongsTo(Projects, { foreignKey: 'id_proyecto' });
Projects.hasMany(Phases, { foreignKey: 'id_proyecto' });

Holidays.belongsTo(Headquarters, { foreignKey: 'id_sede' });
Headquarters.hasMany(Holidays, { foreignKey: 'id_sede' });

Vacation.belongsTo(Technicians, { foreignKey: 'id_tecnico' });
Technicians.hasMany(Vacation, { foreignKey: 'id_tecnico' });

WorkDays.belongsTo(Technicians, { foreignKey: 'id_tecnico' });
Technicians.hasMany(WorkDays, { foreignKey: 'id_tecnico' });

WorkDays.belongsTo(Projects, { foreignKey: 'id_proyecto' });
Projects.hasMany(WorkDays, { foreignKey: 'id_proyecto' });
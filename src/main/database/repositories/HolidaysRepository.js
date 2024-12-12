import { Holidays } from '../models';

export class HolidaysRepository {

    static async getAll() {
        const holidays = await Holidays.findAll({
        })
        if (holidays) {
        return holidays.map(holiday => {
            const holidayData = holiday.dataValues;
            console.log("holidayData: ",holidayData);
            return holidayData;
        });
        }
        return []
    }

    static async insert(holiday){
        console.log("Dia Festivo insertado");
        await Holidays.create({
            ...holiday
        })
    }

    static async deleteById(id_holiday){
        console.log("Dia Festivo eliminado");
        await Holidays.destroy({
            where:{
            id: id_holiday
            }
        })
    }
}                                                                                                                                                                                                                                                                                                                 
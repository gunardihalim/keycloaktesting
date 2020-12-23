export class diffrentDate {
    notAllowFucture (startDate:any, endDate:any) {
        let responFunc = false
        let start = Date.parse(startDate);
        let end = Date.parse(endDate);


        let isDate = function (date) {
            if (isNaN(date))
                return true
            return false
        }

        if (isDate(start) || isDate(end))
            responFunc = true

        let difference = (end - start) / 86400000 ;

        if (difference <= -1)
            responFunc = true

        return responFunc
    }
}
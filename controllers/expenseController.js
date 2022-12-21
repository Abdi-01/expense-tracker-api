const fs = require('fs');
module.exports = {
    getExpense: (req, res) => {
        let data = JSON.parse(fs.readFileSync('./db.json'));
        if (JSON.stringify(req.query) == '{}') {
            let newData = data.expense.map((val, idx) => {
                return {
                    id: val.id,
                    title: val.title,
                    nominal: val.nominal
                }
            })
            res.status(200).send(newData);
        } else {
            res.status(404).send({
                message: 'Data not found'
            });
        }
    },
    getDetail: (req, res) => {
        let data = JSON.parse(fs.readFileSync('./db.json'));
        let getDetail = data.expense.filter((val) => val.id == req.params.id)[0];

        res.status(200).send(getDetail);
    },
    addData: (req, res) => {
        console.log(req.body);
        let data = JSON.parse(fs.readFileSync('./db.json'));
        data.expense.push({
            id: data.expense[data.expense.length - 1].id + 1,
            ...req.body
        });
        fs.writeFileSync('./db.json', JSON.stringify(data));
    
        res.status(200).send({
            success: true,
            data: data.expense[data.expense.length - 1]
        })
    },
    editData:(req, res) => {
        let data = JSON.parse(fs.readFileSync('./db.json'));
        let getIdx = data.expense.findIndex((val) => val.id == req.params.id);
        if (getIdx >= 0) {
            data.expense[getIdx] = { ...data.expense[getIdx], ...req.body };
            fs.writeFileSync('./db.json', JSON.stringify(data));
            res.status(200).send({
                success: true,
                updated: data.expense[getIdx]
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'Data not found'
            })
        }
    },
    deleteData: (req, res) => {
        let data = JSON.parse(fs.readFileSync('./db.json'));
        let getIdx = data.expense.findIndex((val) => val.id == req.params.id);
        if (getIdx >= 0) {
            data.expense.splice(getIdx, 1);
            fs.writeFileSync('./db.json', JSON.stringify(data));
            res.status(200).send({
                success: true
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'Data not found'
            })
        }
    },
    total:(req, res) => {
        let data = JSON.parse(fs.readFileSync('./db.json'));
        let amount = {
            income: 0,
            expense: 0
        }
        data.expense.forEach(element => {
            amount[element.type] += element.nominal
        });
        if (JSON.stringify(req.query) == '{}') {
            res.status(200).send({
                success: true,
                ...amount
            });
        } else {
            for (const key in req.query) {
                if (key == 'type') {
                    return res.status(200).send({
                        success: true,
                        [req.query.type]: amount[req.query.type]
                    })
                } else if (key.includes('date')) {
                    let start = new Date(req.query['date.start']).getTime();
                    let end = new Date(req.query['date.end']).getTime();
    
                    amount = {
                        income: 0,
                        expense: 0
                    }
                    data.expense.forEach(val => {
                        let date = new Date(val.date).getTime();
                        if (start <= date && end >= date) {
                            amount[val.type] += val.nominal;
                        }
                    })
    
                    return res.status(200).send({
                        success: true,
                        ...amount
                    })
                }
            }
        }
    }
}
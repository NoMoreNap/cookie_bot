import mongoose from "mongoose";
import userModel from "./scheme.js";

const { DB_URL = "mongodb://127.0.0.1:27017" } = process.env;

export class Mongo  {

    constructor(dbName) {
        (async () => {
            try {
                await mongoose.connect(`${DB_URL}/${dbName}`);
                this.db = userModel;
                console.log("Success");
            } catch (error) {
                console.log(error);
            }
        })();
    }
    async find(path,data) {
        const findedData = await this.db.find({[path]: data})
        return findedData
    }
    async insert(data) {
        const newData = await this.db.create(data);
        return newData
    }

    async pushReffer(tid, refferal) {
        return this.db.updateOne({tid: tid}, {$push: {'info.refferals': refferal}})

    }
    async getPromos() {
        return this.db.find({$where: 'this.info.promos.length > 0'}, {'info.promos': true})
    }
    async pushPromo(tid, promo) {
        return this.db.updateOne({tid: tid}, {$push: {'info.promos': promo}})

    }

    async pushCookie(tid, id) {
        return this.db.updateOne({tid: tid}, {$push: {'info.cookies': id}})
    }

    async openCookie(tid) {
        await this.db.updateOne({tid: tid}, {$inc: {'info.limit': -1}})
        return this.db.updateOne({tid: tid}, {$inc: {'info.oppend_cookie': 1}})
    }

    async updateLimit(count = 1) {
            return this.db.updateMany({tid: {$exists: true}}, {$inc: {'info.limit': count}})
    }

    async addLimit(tid,count) {
        return this.db.updateOne({tid: tid}, {$inc: {'info.limit': count}})
    }

    async getAllInfo() {
        const allUsers = await this.db.distinct('tid')
        const allReffers = await this.db.find({'reffer_tid': {$gt: 0}}, {'tid': 1})
        return [allUsers, allReffers]
    }



}

import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://amnazokera_db_user:QF86i204ldJmfcWG@cluster0.gxqlwc1.mongodb.net/?appName=Cluster0";
const dbName = "mern-project";
export const collectionName = "app";
const client = new MongoClient(url);

export const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};

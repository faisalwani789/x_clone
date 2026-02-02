import pool from "../config/db.js";
export const sendRequest = async (req, res) => {
  const { toUserId } = req.body;
  const { id: fromUserId } = req.user;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[result]] = await conn.execute("call sendRequest(?,?)", [
      toUserId,
      fromUserId,
    ]);
    console.log(result);
    await conn.commit();
    res.status(201).json({ msg: result[0].result });
  } catch (error) {
    await conn.rollback();
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await conn.release();
  }
};
export const AcceptRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const { id: userId } = req.user;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[result]] = await conn.execute("call acceptFollowRequest(?,?)", [
      requestId,
      userId,
    ]);

    await conn.commit();
    res.status(201).json({ msg: result[0] });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};
export const getFollowRequests = async (req, res) => {
  const { id } = req.user;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[result]] = await conn.execute("call getFollowRequests(?)", [id]);
    await conn.commit();
    res.status(200).json({ msg: result[0] });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};
export const getFollowers = async (req, res) => {
  const { id: userId } = req.user;
  const { id: seeFollowersOf } = req.body;
  let { page, limit } = req.query;
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * 10;
  const conn = await pool.getConnection();
  try {
    const [[result]] = await conn.execute("call getFollowerList(?,?,?,?)", [
      userId,
      seeFollowersOf,
      limit,
      offset,
    ]);

    res.status(200).json({ msg: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

export const getFollowing = async (req, res) => {
  const { id: userId } = req.user;
  const { id: seeFollowingOf } = req.body;
  let { page, limit } = req.query;
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * 10;
  const conn = await pool.getConnection();
  try {
    const [[result]] = await conn.execute("call getFollowerList(?,?,?,?)", [
      userId,
      seeFollowingOf,
      limit,
      offset
    ]);
    res.status(200).json({ msg: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};
// export const removeFollower=async()=>{
//    const{id:userId}=req.user

//     const conn= await pool.getConnection()
//     try {
//         await conn.beginTransaction()
//         const [[result]]=await conn.execute('call removeFollower(?)',[userId])

//         await conn.commit()
//         res.status(200).json({msg:result})
//     } catch (error) {
//         await conn.rollback()
//           res.status(500).json({ success: false, message: error.message })
//     }
//     finally{
//         conn.release()
//     }
// }

import pool from "../config/db.js";

export const getSearchResults = async (req, res) => {
    
    const conn = await pool.getConnection()
    let { query, sortBy = null,direction=null, page, limit } = req.query
    // console.log(query)
    page = Number(page) || 1
    limit = Number(limit) || 10
    const offset = (page - 1) * limit 
    try {
        //get user

        // const [[result]] = await conn.execute('call getSearchResults(?,?,?,?)', [query, sort, limit, offset])
        const [[result]] = await conn.execute('call getSearchResultsV2(?,?,?,?,?)', [query, sortBy,direction, limit, offset])
        // console.log(result)
        res.status(200).json({ success: true, result })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}
import bcrypt from 'bcrypt'
export const verifyUserService=async(conn,email,otp)=>{
    try {
        const[row]=await conn.execute('select * from userotps where email=? and isUsed = 0',[email])

        if(!row || row.length==0){
            throw new Error('invalid request') //user did not requrest otp
            //row not found

        }
        console.log(row)
        if( new Date() >row[0].expiresAt){
            console.log(row[0].expiresAt + ","+new Date())
            throw new Error('otp is expired')
        }
        // if (row[0].isUsed===1){
        //     throw new Error('otp is used')
        // }
        // console.log(otp,row[0].otp)
      
       
        const isMatch = await bcrypt.compare(otp,row[0].otp )
        if (!isMatch) throw new Error('please enter a valid otp')
        const [result] = await conn.execute('update userotps set isUsed=? where email=?', [1, email])
        if(result.changedRows===0){
            throw new Error('cant verify otp')
        }
        return {isSuccess:true}
        
    } catch (error) {
        throw new Error(error)
    }
    
}
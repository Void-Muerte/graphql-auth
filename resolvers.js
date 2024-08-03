
const resolvers = {
    Query:{
        users:()=>{
            return []
        },
        user:(_,{id})=>{
            return null
        }
    }
}
module.exports = resolvers;
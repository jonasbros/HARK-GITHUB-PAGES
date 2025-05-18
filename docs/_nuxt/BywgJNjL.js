import{i,aa as c,j as d,l as u,N as v}from"./Bbm1RNck.js";const I=async()=>({getById:f,getByIds:m,getByEmail:y,save:w,getFollowees:g,saveUserActivity:$,followUser:_,init:S,searchByNameOrEmail:C});async function f(s){var t;const o=i`
    query($id: String) {
      usersCollection(filter: {
        id: {
          eq: $id
        }
      }) {
        edges {
          node {
            id
            email
            name
            avatar
            details
          }
        }
      }
    }
  `;try{const{data:e}=await c(o,{id:s});return(t=e.value.usersCollection.edges[0])==null?void 0:t.node}catch(e){console.error(e)}}async function m(s){const o=i`
    query($ids: [String!]) {
      usersCollection(filter: {
        id: {
          in: $ids
        }
      }) {
        edges {
          node {
            id
            email
            name
            avatar
            details
          }
        }
      }
    }
  `;try{const{data:t}=await c(o,{ids:s});return t.value.usersCollection.edges.map(r=>r.node)}catch(t){return console.error(t),[]}}async function y(s){var t;const o=i`
    query($email: String) {
      usersCollection(filter: {
        email: {
          eq: $email
        }
      }) {
        edges {
          node {
            id
            email
            name
            avatar
            details
          }
        }
      }
    }
  `;try{const{data:e}=await c(o,{email:s});return(t=e.value.usersCollection.edges[0])==null?void 0:t.node}catch(e){console.error(e)}}async function C(s){const o=i`
    query($nameQuery: String, $emailQuery: String) {
      usersCollection(filter: {
        or: [
          { name: { ilike: $nameQuery } },
          { email: { ilike: $emailQuery } }
        ]
      }, first: 10) {
        edges {
          node {
            id
            email
            name
            avatar
            details
          }
        }
      }
    }
  `;try{const t=`%${s}%`,{data:e}=await c(o,{nameQuery:t,emailQuery:t});return e.value.usersCollection.edges.map(r=>r.node)}catch(t){return console.error("Error searching users:",t),[]}}async function w(s){var t;const o=i`
    mutation($email: String, $name: String, $avatar: String) {
      insertIntousersCollection(objects: {
        email: $email
        name: $name
        avatar: $avatar
      }) {
        affectedCount
        records{
          id
          email
          name
          avatar
          details
        }
      }
    }
  `;try{const{mutate:e}=await d(o,{variables:s}),{data:r}=await e();if(!((t=r==null?void 0:r.insertIntousersCollection)!=null&&t.affectedCount))throw new Error("Error: Store User!");return{status:"User successfully saved!",data:r.insertIntousersCollection.records[0]}}catch(e){if(e.message==='duplicate key value violates unique constraint "users_email_key"')return{status:"User already in database!",data:await y(s.email)};console.error(e)}}async function g(s){const o=i`
    query($id: String) {
      followsCollection(filter:{
        follower_id:{
          eq: $id
        }
      }) {
        edges{
          node{
            followee_id
          }
        }
      }
    }
  `;try{const{data:t}=await c(o,{id:s}),e=t.value.followsCollection.edges.map(n=>n.node.followee_id);if(e.length===0)return u().setFollowees([]),[];const r=await m(e);return console.log(r),u().setFollowees(r),r}catch(t){return console.error(t),[]}}async function _(s,o){var e;const t=i`
    mutation($userId: String!, $followeeId: String!) {
      insertIntofollowsCollection(objects: {
        follower_id: $userId
        followee_id: $followeeId
      }) {
        affectedCount
        records {
          id
          follower_id
          followee_id
        }
      }
    }
  `;try{const{mutate:r}=await d(t,{variables:{userId:s,followeeId:o}}),{data:a}=await r();if(!((e=a==null?void 0:a.insertIntofollowsCollection)!=null&&e.affectedCount))throw new Error("Error: Follow User!");const n=a.insertIntofollowsCollection.records[0],l=await f(o);return u().addFollowee(l),await $({userId:s,activityType:"follow",description:`Started following ${l.name}`}),{status:"success",data:{...n,followee:l}}}catch(r){return console.error(r),{status:"error",message:r.message}}}async function $(s){var t,e;const o=i`
    mutation($userId: String!, $activityType: String!, $description: String!){
      insertIntouser_activityCollection(objects:{
        user_id: $userId
        activity_type: $activityType
        description: $description
      }) {
        affectedCount
        records{
          id
          activity_type
          description
          users{
            id
            name
            email
            avatar
          }
        }
      }
    }
  `;try{const{mutate:r}=await d(o,{variables:s}),{data:a}=await r();if(!((t=a==null?void 0:a.insertIntouser_activityCollection)!=null&&t.affectedCount))throw new Error("Error: User Activity!");const n=a.insertIntouser_activityCollection.records[0];return{status:(e=a==null?void 0:a.insertIntouser_activityCollection)!=null&&e.affectedCount?"success":"failed",data:n}}catch(r){console.error(r)}}async function S(){const s=u(),{value:o}=v();let e=await y(o.email);if(!e){const r=o.email,a=o.user_metadata.full_name,n=o.user_metadata.avatar_url,{data:l}=await w({email:r,name:a,avatar:n});e=l}e&&(s.setAuthUser(e),await g(e.id))}export{I as u};

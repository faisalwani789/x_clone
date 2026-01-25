
CREATE  getProfile`(in p_userId int)
begin
  select 
	tweetId,
	tweetedBy,
    tweet,
    (select coalesce (json_arrayagg(
				json_object(
                'image',m.imageUrl
                )
            ),json_array()) from mediaimages m where m.refId=tweetId and m.type=1) as media,
	case rType
		when 2 then json_object(
			'id',repostId,
			'repostedBy', repostedBy
        )
        when 3 then json_object(
			'content',ins.content,
            'quotedBy',repostedBy,
            'id',repostId,
            'profile',1,
            'userName',concat('@',replace(repostedBy,' ','')),
			'media',(select coalesce (json_arrayagg(
				json_object(
                'image',m.imageUrl
                )
            ) ,json_array() )from mediaimages m where m.refId=repostId and m.type=3)
        )
        end as repost
        
 from  
(select
 r.type as rType,r.content ,r.id as repostId,
 t.content as tweet ,
 t.id as tweetId ,
 t.userId as tweetedById,
 r.userId as repostedById ,
 u.fullName as tweetedBy ,
 u2.fullName as repostedBy 
 from 
tweets t join user u on t.userId =u.id  
left join reposts r on r.refId =t.id and r.userId=p_userId left join user u2 on r.userId=u2.id
where r.id is not null or t.userId=1 )ins;
end
delimiter $$
create TRIGGER audit_tweets_after_insert
	AFTER Insert  on tweets
    for EACH ROW 
begin
 insert into tweet_audit(tweetId,userId,newContent,type,newIsActive, operation)
 values(new.id,new.userId,new.content,new.type,new.isActive,'insert');

end $$
delimiter ;


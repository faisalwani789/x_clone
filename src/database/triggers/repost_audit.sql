-- add reposts
delimiter $$
create TRIGGER audit_reposts_after_insert
	AFTER Insert  on reposts
    for EACH ROW 
begin
 insert into repost_audit(retweetId,userId,newContent,refId,type,newIsActive,parentRef, operation)
 values(new.id,new.userId,new.content,new.refId,new.type,new.isActive,new.parentRef,'insert');

end $$
delimiter ;
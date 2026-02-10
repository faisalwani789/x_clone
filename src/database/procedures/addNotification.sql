CREATE  PROCEDURE `addNotification`(in p_refId int , p_type int, p_targetUserId  int ,p_message varchar(255),out p_notificationId int)
BEGIN
-- refId can be tweet, retweet, follower, like ,comment
 insert into notifications(refId,type,targetUserId,message) values(p_refId,p_type,p_targetUserId,p_message);
 set p_notificationId= last_insert_id();
END
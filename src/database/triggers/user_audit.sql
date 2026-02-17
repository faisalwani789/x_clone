create TRIGGER audit_user_afer_insert
	AFTER Insert  on user
    for EACH ROW 
begin
 insert into user_audit(userId,newName,newProfilePic,newCover,newIsPrivate,newIsActive,newIsTwoFactorAuthentication ,newIsVerified, newBio, operation)
 values(new.id,new.fullName,new.profilePic,new.coverImage,new.isPrivate,new.isActive,new.isTwoFactorAuthentication,new.isVerified,new.bio,'insert');

end $$
delimiter ;



delimiter $$
create TRIGGER audit_user_after_update
	AFTER update  on user
    for EACH ROW 
begin
 insert into user_audit
 (userId,
 oldName,newName,
 oldprofilePic,newProfilePic,
 oldCover,newCover,
 oldIsActive,newIsActive,
 oldIsPrivate,newIsPrivate,
 oldIsTwoFactorAuthentication,newIsTwoFactorAuthentication,
 oldBio,newBio,
 oldIsVerified,newIsVerified,
 operation)
 values(old.id,old.fullName,new.fullName,old.profilePic,new.profilePic,old.coverImage,new.coverImage,old.isActive,new.isActive,old.isPrivate,new.isPrivate,
 old.isTwoFactorAuthentication,new.isTwoFactorAuthentication,old.bio,new.bio,old.isVerified,new.isVerified,'update');

end $$
delimiter ;

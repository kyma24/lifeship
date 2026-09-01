
alter table exceptions alter column device_id type text;
update exceptions set device_id = 'unknown' where device_id is null;
alter table exceptions alter column device_id set not null;

alter table exceptions alter column user_id set default auth.uid();
alter table exceptions add constraint items_user_id_fkey foreign key (user_id) references auth.users(id);
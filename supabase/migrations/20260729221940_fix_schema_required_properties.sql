
alter table items alter column device_id type text;

update items set device_id = 'unknown' where device_id is null;
update items set checked = false where variant = 'task' and checked is null;
update items set fixed = false where variant = 'block' and fixed is null;
update items set child_order = 0 where child_order is null;

alter table items add column created_at timestamptz not null default now();

alter table items alter column user_id set default auth.uid();
alter table items add constraint items_user_id_fkey foreign key (user_id) references auth.users(id);

alter table items alter column device_id set not null;

alter table items 
    alter column child_order set not null,
    alter column child_order set default 0;

alter table items
    drop constraint valid_variant_fields,
    add constraint valid_variant_fields check (
        (variant = 'task' and fixed is null and checked is not null) or
        (variant = 'block' and checked is null and fixed is not null)
    );
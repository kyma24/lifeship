create table items (
    -- necessary properties
    id text primary key,
    variant text not null check (variant in ('task', 'block')),
    name text not null,

    -- shared item properties
    description text,
    parent_id text references items(id),
    child_order integer,
    tags text[],

    -- do info
    do_date text,
    duration integer,
    timezone text,
    -- time period
    time_period_type text,
    exact_mins_date_start integer,
    time_of_day text,
    -- recurrence
    rrule text,
    end_date text,

    -- display
    color text,
    icon text,

    -- unique to task
    priority integer,
    checked boolean,

    -- unique to block
    fixed boolean,

    -- for sync
    deleted_at timestamptz,
    updated_at timestamptz,
    device_id uuid,
    user_id uuid not null
);

alter table items add constraint valid_variant_fields check (
    (variant = 'task' and fixed is null) or
    (variant = 'block' and checked is null)
);

create index ind_items_user_updated on items (user_id, updated_at);


alter table items enable row level security;

create policy "User only manages own items"
    on items for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
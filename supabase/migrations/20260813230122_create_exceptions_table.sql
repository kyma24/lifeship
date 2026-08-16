create table exceptions (
    -- necessary properties
    id text primary key,
    item_id text not null references items(id),
    effect_date text not null,
    occurrence_index integer,
    variant text not null check (variant in ('modified', 'deleted')),

    -- overrides
    name text,
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

    -- for sync
    deleted_at timestamptz,
    updated_at timestamptz,
    created_at timestamptz,
    device_id uuid,
    user_id uuid not null
);

create index ind_exceptions_user_updated on exceptions (user_id, updated_at);

alter table exceptions enable row level security;

create policy "User only manages own items"
    on exceptions for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
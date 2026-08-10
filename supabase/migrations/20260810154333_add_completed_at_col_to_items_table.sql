
alter table items add column checked_at timestamptz;

alter table items add constraint valid_checked_state check (
    (variant = 'task' and checked is true and checked_at is not null) or
    (variant = 'task' and checked is false and checked_at is null) or
    (variant = 'block' and checked_at is null)
);
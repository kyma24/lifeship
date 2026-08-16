
alter table exceptions add column checked_at timestamptz;

alter table exceptions add constraint valid_checked_state check (
    (checked is true and checked_at is not null) or
    (checked is false and checked_at is null)
);
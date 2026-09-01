alter table exceptions add column overrides jsonb not null default '{}'::jsonb;

/*
// backfill; unneeded, no stored datapoints
update exceptions
    set overrides = jsonb_strip_nulls(
        jsonb_build_object(
            'name', name,
            'description', description,
            'parentId', parent_id,
            'childOrder', child_order,
            'tags', tags,
            'doDate', do_date,
            'duration', duration,
            'timezone', timezone,
            'timePeriodType', time_period_type,
            'exactMinsDateStart', exact_mins_date_start,
            'timeOfDay', time_of_day,
            'rrule', rrule,
            'endDate', end_date,
            
            'color', color,
            'icon', icon,
            
            'priority', priority,
            'checked', checked
        )
    )
    where 
        name is not null or
        description is not null or
        parent_id is not null or
        child_order is not null or
        tags is not null or
        do_date is not null or
        duration is not null or
        timezone is not null or
        time_period_type is not null or
        exact_mins_date_start is not null or
        time_of_day is not null or
        rrule is not null or
        end_date is not null or
        color is not null or
        icon is not null;
*/
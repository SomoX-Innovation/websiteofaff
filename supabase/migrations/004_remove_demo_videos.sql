-- Remove rows that only pointed at Google GTV sample bucket demos.
delete from public.offers
where video_url like '%gtv-videos-bucket/sample/%';

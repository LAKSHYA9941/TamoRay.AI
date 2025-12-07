ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_policy ON users FOR ALL USING (clerk_id = current_setting('app.clerk_user_id'));
CREATE POLICY jobs_policy ON jobs FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_user_id')));
CREATE POLICY payments_policy ON payments FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_user_id')));
CREATE POLICY brand_kits_policy ON brand_kits FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_user_id')));
CREATE POLICY analytics_policy ON analytics FOR ALL USING (job_id IN (SELECT id FROM jobs WHERE user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_user_id'))));
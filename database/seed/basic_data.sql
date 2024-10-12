
INSERT INTO users(
  username, 
  first_name, 
  last_name, 
  email, 
  is_admin,
  max_api_keys,
  updated_at,
  password_salt,
  password_hash
)
VALUES 
  ('gtindo', 'Yvan', 'Guekeng', 'yvan.guekeng@example.com', true, null, datetime(), '072c26ee0d508062',
    'e57eea7e9debfb9b5d76d3f6b49b149a4595df69c6542e77a4b8c18ca96ac724eccea886a8c2e767b54b4556c992da75657976bdf8737e72a722e39fe1f203d3'),
  ('joe97', 'John', 'Doe', 'john.doe@example.com', false, 5, datetime(), '3a17dfc0ada9c430',
  '7485c79a392402eabdbf715887f8d86a6210eb0f8a8779e6ef4d459b721d907a898b97c49a1da402d7fd4eb0f4a4b2f15ffadf1f9f183c91b04724135bca9bf6');


INSERT INTO api_keys(name, value, max_usage, owner_id, updated_at)
VALUES
  ('Default gtindo api key', '019281a7-eeb2-71c8-abb9-b918e6722f9b', null, 1, datetime()),
  ('Default joe97 api key', '019281a6-4682-7ce1-ad4b-dcaeff9e67b9', 2000, 2, datetime());

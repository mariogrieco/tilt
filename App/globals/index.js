const IS_DEV_ENV = process.env.NODE_ENV === 'development';

export let mod_user_id;
export let tilt_user_id;
export let moderator_user_id;

if (IS_DEV_ENV) {
  mod_user_id = 'kx5fwtdqninxtpa1sq54e49eur';
  tilt_user_id = '7h7wo4hxjfrsu8zdi7bdefz9wa';
  moderator_user_id = 'uarbye44df8gze3rnx5n8e3o5h';
} else {
  mod_user_id = 'sgsrqsirepfi5kg8bnb8e5gnbo';
  tilt_user_id = 'jk5osmydatgt5kaahkeheprk6e';
  moderator_user_id = 'xcmomnxtji8f7r6atftifs994r';
}

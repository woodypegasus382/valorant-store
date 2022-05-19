import { RiotApiClient, Region } from '@survfate/valorant.js';
import type { IAccessToken } from '@survfate/valorant.js/dist/models/IAccessToken';
import type { IStorefrontParsed } from '@survfate/valorant.js/dist/models/IStorefrontParsed';

export interface Skin {
  name: string;
  price: number;
  image?: string;
  id: string;
}

export const getSkins = async (
  subject: string,
  token: IAccessToken,
  rsoToken: string,
  region: string
): Promise<Skin[]> => {
  const shard = ['latam', 'br'].includes(region) ? 'na' : region;

  const client = new RiotApiClient({
    region: new Region(
      `https://pd.${shard}.a.pvp.net`,
      `https://shared.${shard}.a.pvp.net`,
      `https://glz-${region}-1.${shard}.a.pvp.net`,
      region
    ),
    password: '',
    username: ''
  });

  client.auth = {
    accessToken: token,
    rsoToken
  };

  client.buildServices();

  const [offers, content] = await Promise.all([
    client.storeApi.getStorefront(subject, true, 'en-US'),
    client.contentApi.getWeaponSkinlevels('en-US')
  ]);

  return (offers as IStorefrontParsed).skins.map(skin => {
    const skinData = (
      content as Array<{ displayIcon: string; uuid: string }>
    ).find(data => data.uuid === skin.id);

    return {
      id: skin.id,
      price: skin.cost.amount,
      name: skin.name,
      image: skinData?.displayIcon
    };
  });
};

export const login = async (username: string, password: string) => {
  const client = new RiotApiClient({
    region: Region.NA,
    password,
    username
  });

  await client.login();

  return {
    user: client.user,
    auth: client.auth
  };
};

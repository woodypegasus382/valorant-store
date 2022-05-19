import { RiotApiClient, Region } from '@survfate/valorant.js';
import type { IAccessToken } from '@survfate/valorant.js/dist/models/IAccessToken';
import type { IStorefrontParsed } from '@survfate/valorant.js/dist/models/IStorefrontParsed';

export interface Skin {
  name: string;
  price: number;
  image?: string;
  id: string;
}

const buildRegion = (region: string) => {
  const shard = ['latam', 'br'].includes(region) ? 'na' : region;

  return new Region(
    `https://pd.${shard}.a.pvp.net`,
    `https://shared.${shard}.a.pvp.net`,
    `https://glz-${region}-1.${shard}.a.pvp.net`,
    region
  );
};

export const getSkins = async (params: {
  region: string;
  accessToken: IAccessToken;
  rsoToken: string;
  subject: string;
}): Promise<Skin[]> => {
  const client = new RiotApiClient({
    region: buildRegion(params.region),
    password: '',
    username: ''
  });

  client.auth = {
    accessToken: params.accessToken,
    rsoToken: params.rsoToken
  };

  client.buildServices();

  const [offers, content] = await Promise.all([
    client.storeApi.getStorefront(params.subject, true, 'en-US'),
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

export const login = async (payload: {
  username: string;
  password: string;
  region: string;
}) => {
  const client = new RiotApiClient({
    region: buildRegion(payload.region),
    password: payload.password,
    username: payload.username
  });

  await client.login();

  return {
    user: client.user,
    auth: client.auth
  };
};

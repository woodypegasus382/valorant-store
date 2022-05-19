import type { FC } from 'react';
import type { Skin as ISkin } from '~/models/valorant.server';

type SkinProps = {
  skin: ISkin;
};

const Skin: FC<SkinProps> = ({ skin }) => {
  return (
    <div className="p-8 relative flex items-center border-[#ff4654] justify-between flex-col space-y-4 border rounded-lg shadow-md">
      <div className="bg-[#ff4654] font-bold text-[#101822] absolute right-2 top-2 rounded-md p-2">
        {skin.price}
      </div>

      <div className="h-44 w-full flex items-center justify-center">
        <img src={skin.image} className="object-contain w-full h-full" alt="" />
      </div>

      <p className="text-center font-['Valorant']">{skin.name}</p>
    </div>
  );
};

export default Skin;

import ComboDetailHero from "../../components/combo/ComboDetailHero"
import ComboServiceList from "../../components/combo/ComboServiceList"
import ComboPriceCompare from "../../components/combo/ComboPriceCompare"
import ComboBenefits from "../../components/combo/ComboBenefits"
import ComboGallery from "../../components/combo/ComboGallery"
import { type ComboDetail } from "../../types/combo"

export default function ComboDetailPage({ combo }: { combo: ComboDetail }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Hero */}
      <ComboDetailHero combo={combo} />

      {/* Main body */}
      <section className="w-full bg-white py-14 px-4 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          {/*
            Desktop : content 2/3 + sticky price sidebar 1/3
            Mobile  : stack (content → price)
          */}
          <div className="flex flex-col lg:flex-row gap-12">

            {/* LEFT: service list + benefits + gallery */}
            <div className="flex-1 min-w-0">
              <ComboServiceList services={combo.services} />
              <ComboBenefits combo={combo} />
              {combo.gallery && combo.gallery.length > 0 && (
                <ComboGallery images={combo.gallery} name={combo.name} />
              )}
            </div>

            {/* RIGHT: sticky price */}
            <div className="w-full lg:w-[300px] shrink-0">
              <ComboPriceCompare combo={combo} />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
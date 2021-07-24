const systems = [
    {
        system: 'Circulatory System',
        bodyParts: [
            'blood',
            'heart',
            'artery',
            'vein'
        ]
    },
    {
        system: 'Digestive System',
        bodyParts: [
            'mouth',
            'pharynx',
            'esophagus',
            'stomach',
            'intestines',
            'liver',
            'gallbladder',
            'abdomen',
            'appendix'
        ]
    },
    {
        system: 'Endocrine System',
        bodyParts: [
            'thyroid glands',
            'pituitary glands',
            'adrenal glands'
        ]
    },
    {
        system: 'Exocrine and Integumentory System',
        bodyParts: [
            'skin',
            'hair',
            'nails'
        ]
    },
    {
        system: 'Immune and Lymphatic System',
        bodyParts: [
            'bone marrow',
            'spleen',
            'tonsils',
            'lymph fluid', 'nodes', 'ducts', 'vessels'
        ]
    },
    {
        system: 'Urinary and Renal System',
        bodyParts: [
            'kindney', 'urinary bladder'
        ]
    },
    {
        system: 'Reproductive System',
        bodyParts: [
            'uterus',
            'ovaries',
            'fallopian tubes',
            'testes'
        ]
    },
    {
        system: 'Respiratory System',
        bodyParts: [
            'nose',
            'lungs',
            'bronchus',
            'trachea'
        ]
    },
    {
        system: 'Skeletal and Muscular System',
        bodyParts: [
            'muscles',
            'bones'
        ]
    },
    {
        system: 'Exterior Body Parts',
        bodyParts: [
            'hands', 'legs', 'thigh', 'eyes', 'ears'
        ]
    }
]

const part = 'Mouth'.toLowerCase()
var system;
const display = systems.forEach(element => {
    if (element.bodyParts.includes(part)) {
        system = element.system
    }
});
system = system == undefined ? 'Unknown' : system
console.log(system)
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ENUMS = [
  'UserRole: Client, Manufacturer, Labour',
  'UserState: New, Active, Suspended, Blocked, Verified',
  'VerificationStatus: Pending, UnderReview, Verified, Rejected',
  'OrderStatus: Pending, Bidding, Active, InProgress, Completed, Cancelled, Disputed',
  'PaymentStatus: Pending, PartialPaid, Escrowed, Released, Refunded, Completed',
  'NotificationType: Order, Payment, Message, System, Verification',
];

const CLASSES = [
  {
    name: 'User',
    color: 'border-slate-400',
    attrs: ['id', 'email', 'password', 'phone', 'role', 'state'],
    methods: ['login()', 'logout()', 'updateProfile()'],
  },
  {
    name: 'Client',
    color: 'border-blue-500',
    extends: 'User',
    attrs: ['companyName', 'address', 'orders[]', 'documents[]'],
    methods: ['createOrder()', 'viewManufacturers()', 'makePayment()'],
  },
  {
    name: 'Manufacturer',
    color: 'border-red-500',
    extends: 'User',
    attrs: ['companyName', 'category', 'affidavit', 'labourHired[]', 'rating'],
    methods: ['bidOnOrder()', 'hireLabour()', 'submitAffidavit()'],
  },
  {
    name: 'Labour',
    color: 'border-amber-500',
    extends: 'User',
    attrs: ['name', 'skills[]', 'hourlyRate', 'location', 'skillProofs[]'],
    methods: ['uploadSkillProof()', 'updateAvailability()'],
  },
  {
    name: 'Verification',
    color: 'border-violet-500',
    attrs: ['userId', 'status', 'documents[]', 'submittedAt'],
    methods: ['submitDocuments()', 'approve()', 'reject()'],
  },
  {
    name: 'Document',
    color: 'border-purple-500',
    attrs: ['type', 'fileUrl', 'videoUrl', 'uploadedAt'],
    methods: ['upload()'],
  },
  {
    name: 'Order',
    color: 'border-emerald-500',
    attrs: ['clientId', 'manufacturerId', 'title', 'quantity', 'budget', 'status', 'bids[]'],
    methods: ['addBid()', 'acceptBid()', 'completeOrder()'],
  },
  {
    name: 'Bid',
    color: 'border-teal-500',
    attrs: ['manufacturerId', 'orderId', 'amount', 'accepted'],
    methods: ['accept()'],
  },
  {
    name: 'Payment',
    color: 'border-green-600',
    attrs: ['orderId', 'amount', 'status', 'paidAt'],
    methods: ['processPayment()'],
  },
  {
    name: 'EscrowPayment',
    color: 'border-green-500',
    extends: 'Payment',
    attrs: ['upfrontAmount (30%)', 'finalAmount (70%)', 'upfrontPaid', 'finalPaid'],
    methods: ['releaseUpfrontPayment()', 'releaseFinalPayment()'],
  },
  {
    name: 'Message',
    color: 'border-orange-500',
    attrs: ['senderId', 'receiverId', 'content', 'read'],
    methods: ['markAsRead()'],
  },
  {
    name: 'Notification',
    color: 'border-orange-400',
    attrs: ['userId', 'type', 'message', 'read'],
    methods: ['markAsRead()'],
  },
  {
    name: 'Review',
    color: 'border-pink-500',
    attrs: ['orderId', 'reviewerId', 'rating (1-5)', 'comment'],
    methods: ['submit()'],
  },
];

export default function SkilloraClassDiagram() {
  const { isDarkMode } = useTheme();
  const surface = isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const muted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen p-6 md:p-10 ${surface}`}>
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Skillora — UML class diagram</h1>
          <p className={`mt-2 max-w-3xl text-sm ${muted}`}>
            Domain model for the labour–manufacturer–client platform: users, orders, escrow payments, verification,
            and messaging.
          </p>
        </header>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Enumerations</h2>
          <ul className={`grid gap-2 text-sm md:grid-cols-2 ${muted}`}>
            {ENUMS.map((e) => (
              <li key={e} className="rounded-lg border border-slate-600/40 bg-slate-800/30 px-3 py-2 dark:bg-slate-800/50">
                {e}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Classes</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CLASSES.map((c) => (
              <Card key={c.name} className={`border-2 ${c.color} ${isDarkMode ? 'bg-slate-800/80' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {c.name}
                    {c.extends ? (
                      <span className={`ml-2 text-xs font-normal ${muted}`}>extends {c.extends}</span>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>
                    <div className={`font-medium ${muted}`}>Attributes</div>
                    <ul className="mt-1 list-inside list-disc space-y-0.5">
                      {c.attrs.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className={`font-medium ${muted}`}>Methods</div>
                    <ul className="mt-1 list-inside list-disc space-y-0.5">
                      {c.methods.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Relationships</h2>
          <div
            className={`rounded-xl border p-4 text-sm ${
              isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
            }`}
          >
            <ul className={`list-inside list-disc space-y-2 ${muted}`}>
              <li>
                <strong className="text-inherit">Inheritance:</strong> User → Client, Manufacturer, Labour; Payment →
                EscrowPayment
              </li>
              <li>
                <strong className="text-inherit">Composition:</strong> Order ◆→ Bid[]; Verification ◆→ Document[]
              </li>
              <li>
                <strong className="text-inherit">Association:</strong> Client creates Order; Manufacturer bids on Order;
                Manufacturer hires Labour
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

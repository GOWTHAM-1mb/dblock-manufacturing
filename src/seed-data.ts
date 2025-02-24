
import { supabase } from "./integrations/supabase/client";

export const seedDummyData = async (userId: string) => {
  // Add dummy RFQs
  const { data: rfqData, error: rfqError } = await supabase
    .from('rfqs')
    .insert([
      {
        material: 'Aluminum 6061',
        quantity: 100,
        special_instructions: 'Need precision machining',
        user_id: userId,
        expected_delivery_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        step_file_path: 'path/to/step/file1.step',
        drawing_file_path: 'path/to/drawing1.pdf',
        status: 'pending'
      },
      {
        material: 'Stainless Steel 304',
        quantity: 50,
        special_instructions: 'Surface finish required',
        user_id: userId,
        expected_delivery_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        step_file_path: 'path/to/step/file2.step',
        drawing_file_path: 'path/to/drawing2.pdf',
        status: 'quoted'
      }
    ])
    .select();

  if (rfqData) {
    // Add dummy quotes for the RFQs
    await supabase
      .from('quotes')
      .insert([
        {
          rfq_id: rfqData[0].id,
          user_id: userId,
          quoted_price: 1500.00
        },
        {
          rfq_id: rfqData[1].id,
          user_id: userId,
          quoted_price: 2300.00
        }
      ]);
  }

  // Add dummy orders
  await supabase
    .from('orders')
    .insert([
      {
        part_name: 'Custom Bracket',
        material: 'Aluminum 6061',
        quantity: 75,
        price: 1875.00,
        status: 'in_progress',
        delivery_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: userId,
        drawing_file_path: 'path/to/drawing3.pdf',
        step_file_path: 'path/to/step/file3.step'
      },
      {
        part_name: 'Mounting Plate',
        material: 'Steel 1018',
        quantity: 25,
        price: 950.00,
        status: 'completed',
        delivery_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: userId,
        drawing_file_path: 'path/to/drawing4.pdf',
        step_file_path: 'path/to/step/file4.step'
      }
    ]);
};
